package es.ucm.fdi.iw.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.security.Principal;
import java.util.Calendar;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Code;
import es.ucm.fdi.iw.model.User;

@Controller	
public class RootController {

	private static Logger log = Logger.getLogger(RootController.class);
	
	@Autowired
	private LocalData localData;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EntityManager entityManager;
	
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "/static");
    }
    
    @RequestMapping(value = "/createUser", method = RequestMethod.POST)
	@Transactional
	public String createUser(
			@RequestParam String nickname, 
			@RequestParam String password,
			@RequestParam String confirmPassword, Model m) {
		User u = new User();
		u.setNickname(nickname);
		u.setPassword(passwordEncoder.encode(password));
		u.setWin(0);
		u.setDraw(0);
		u.setLose(0);
		u.setEnabled((byte) 0x01);
		u.setRoles("USER");
		entityManager.persist(u);
		
		entityManager.flush();
		login(m);
		
		return "login";
	}
    
    @RequestMapping(value = "/createCode", method=RequestMethod.POST)
    @Transactional
    public String handleFileUpload(
    		HttpServletResponse response,
    		@RequestParam("code") String code,
    		@RequestParam("codeFileName") String codeFileName,
    		HttpSession s,
    		Model m){
    	response.setHeader("X-XSS-Protection", "0");
    	log.info(codeFileName);
    	log.info(code);
		String error = "";
        if (code.isEmpty()) {
        	error = "You failed to upload a photo for " 
                + codeFileName + " because the file was empty.";     
        	log.info(error);
        } else {
        	
	    		Code codeObject= new Code();
	    		User u = new User();
	    		u.setId(Long.parseLong(s.getAttribute("user").toString()));
	    		log.info(u.getId()+u.getNickname());
	    		codeObject.setCreator(u);
	    		codeObject.setDescription("");
	    		codeObject.setName(codeFileName);
	    		codeObject.setCodeText(code);
	    		codeObject.setCreationTime(Calendar.getInstance().getTime());

	    		entityManager.persist(codeObject);
	    		
	    		entityManager.flush();
	    		
	    		File f = localData.getFile("codes", String.valueOf(codeObject.getId()));
	    		try (BufferedOutputStream stream =
		                new BufferedOutputStream(
		                		new FileOutputStream(f)
		                )
		        )
	    		{
	    			stream.write(code.getBytes());
	     
	    		} catch (Exception e) {
	    			error = "Upload failed " + codeFileName + " => " + e.getMessage();
	    		}
	    		
	            return "/code-design";
	            
        }
        // exit with error, blame user
    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return error;
	}
    
	@GetMapping({"/", "/index"})
	public String root(Model model, Principal principal, HttpSession s) {
		
			log.info(principal.getName() + " de tipo " + principal.getClass());
		
			if (s.getAttribute("user") == null) {
				s.setAttribute("user", entityManager
						.createQuery("from User where nickname = :nickname", User.class)
	                    .setParameter("nickname", principal.getName())
	                    .getSingleResult());
			}
			// org.springframework.security.core.userdetails.User

		return "home";
	}
	
	@GetMapping("/login")
	public String login(Model m) {
		return "login";
	}
	
	@GetMapping("/logout")
	public String logout() {
		return "logout";
	}
	
	@GetMapping("/upload")
	public String upload() {
		return "upload";
	}
	
	@GetMapping("/results")
	public String results() {
		return "results";
	}
	
	@GetMapping("/playing")
	public String playing() {
		return "playing";
	}
	
	@GetMapping("/map-design")
	public String map_design() {
		return "map-design";
	}

	@GetMapping("/code-design")
	public String code_design(HttpServletResponse response) {
		response.setHeader("X-XSS-Protection", "0");
		return "code-design";
	}
	
	@GetMapping("/profile")
	public String profile() {
		return "profile";
	}
	
	@GetMapping("/settings")
	public String settings() {
		return "settings";
	}
	
	@GetMapping("/ranking")
	public String ranking() {
		return "ranking";
	}
	
}
